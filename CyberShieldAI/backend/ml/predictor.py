import pandas as pd
import joblib
from features import extract_features

# Load model
model = joblib.load("models/phishing_model_v2.pkl")

while True:
    url = input("Enter URL (or 'exit'): ")

    if url.lower() == "exit":
        break

    features = extract_features(url)

    sample = {
        "URL": url,
        **features
    }

    # Convert to DataFrame
    sample_df = pd.DataFrame([sample])

    prediction = model.predict(sample_df)[0]

    print("Prediction:", prediction)

    if prediction == "good":
        print("✅ Safe Website\n")
    else:
        print("❌ Phishing Website\n")