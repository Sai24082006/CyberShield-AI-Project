import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

from features import extract_features


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "phishing_site_urls.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "phishing_model_v2.pkl"
)

os.makedirs(MODEL_DIR, exist_ok=True)


# ============================================================
# LOAD DATASET
# ============================================================

print("=" * 60)
print("CYBERSHIELD AI - PHISHING MODEL TRAINING")
print("=" * 60)

print("\nLoading dataset...")

df = pd.read_csv(DATASET_PATH)

print("Dataset Loaded Successfully")
print("Original samples:", len(df))


# ============================================================
# CLEAN DATA
# ============================================================

print("\nCleaning dataset...")

df = df.dropna(subset=["URL", "Label"])

df["URL"] = df["URL"].astype(str).str.strip()
df["Label"] = df["Label"].astype(str).str.strip().str.lower()

# Remove empty URLs
df = df[df["URL"] != ""]

# Remove duplicate URLs
df = df.drop_duplicates(subset=["URL"])

# Keep only valid classes
df = df[df["Label"].isin(["good", "bad"])]

print("Clean unique samples:", len(df))

print("\nLabel distribution:")
print(df["Label"].value_counts())


# ============================================================
# EXTRACT FEATURES
# ============================================================

print("\nExtracting URL features...")

feature_rows = []

for i, url in enumerate(df["URL"]):

    feature_rows.append(
        extract_features(url)
    )

    if (i + 1) % 25000 == 0:
        print(
            f"Processed {i + 1} / {len(df)} URLs"
        )

feature_df = pd.DataFrame(feature_rows)


# ============================================================
# COMBINE URL + FEATURES
# ============================================================

data = pd.concat(
    [
        df["URL"].reset_index(drop=True),
        feature_df.reset_index(drop=True)
    ],
    axis=1
)

y = df["Label"].reset_index(drop=True)


# ============================================================
# FEATURE LIST
# ============================================================

NUMERIC_FEATURES = [
    "url_length",
    "num_dots",
    "num_hyphens",
    "num_digits",
    "num_slashes",
    "https",
    "has_ip",
    "subdomain_count",
    "hostname_length",
    "path_length",
    "query_length",
    "directory_count",
    "has_at",
    "has_question",
    "has_equal",
    "has_ampersand",
    "has_percent",
    "has_hash",
    "num_at",
    "num_question",
    "num_equal",
    "num_ampersand",
    "num_percent",
    "suspicious_words",
]


print("\nFeatures being used:")

for feature in NUMERIC_FEATURES:
    print(" -", feature)


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

print("\nSplitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    data,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# PREPROCESSING
# ============================================================

print("\nBuilding preprocessing pipeline...")

preprocessor = ColumnTransformer(
    transformers=[

        # Character-level URL patterns
        (
            "url_tfidf",

            TfidfVectorizer(
                analyzer="char",
                ngram_range=(3, 5),
                min_df=2,
                max_features=150000,
                sublinear_tf=True
            ),

            "URL"
        ),

        # Numeric URL features
        (
            "numeric_features",

            StandardScaler(),

            NUMERIC_FEATURES
        ),
    ]
)


# ============================================================
# MODEL
# ============================================================

classifier = LogisticRegression(
    max_iter=1000,
    class_weight="balanced",
    solver="saga",
    random_state=42,
    n_jobs=-1
)


model = Pipeline(
    [
        (
            "preprocessor",
            preprocessor
        ),

        (
            "classifier",
            classifier
        )
    ]
)


# ============================================================
# TRAIN MODEL
# ============================================================

print("\n" + "=" * 60)
print("TRAINING MODEL")
print("=" * 60)

print("\nTraining on the cleaned dataset.")
print("This may take several minutes.")
print("Do not close the terminal.\n")


model.fit(
    X_train,
    y_train
)


print("\nModel training completed!")


# ============================================================
# PREDICTIONS
# ============================================================

print("\nGenerating predictions...")

predictions = model.predict(X_test)


# ============================================================
# ACCURACY
# ============================================================

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\n" + "=" * 60)
print("MODEL RESULTS")
print("=" * 60)

print(
    f"\nAccuracy: {accuracy * 100:.2f}%"
)


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

print("\nClassification Report:\n")

print(
    classification_report(
        y_test,
        predictions
    )
)


# ============================================================
# CONFUSION MATRIX
# ============================================================

print("Confusion Matrix:\n")

print(
    confusion_matrix(
        y_test,
        predictions
    )
)


# ============================================================
# SAVE MODEL
# ============================================================

print("\nSaving model...")

joblib.dump(
    model,
    MODEL_PATH
)

print("\n" + "=" * 60)
print("MODEL SAVED SUCCESSFULLY")
print("=" * 60)

print("\nLocation:")
print(MODEL_PATH)

print("\nTraining completed!")