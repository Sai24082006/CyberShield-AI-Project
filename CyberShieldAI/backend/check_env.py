import sys
import ssl
import pymongo
import certifi

print("Python:", sys.version)
print("OpenSSL:", ssl.OPENSSL_VERSION)
print("PyMongo:", pymongo.version)
print("Certifi:", certifi.where())
