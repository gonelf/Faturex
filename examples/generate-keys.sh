#!/bin/bash

# Generate RSA Key Pair for Portuguese Billing System
# This script generates a 1024-bit RSA key pair as required by Portaria n.º 363/2010

echo "=============================================="
echo "Portuguese Billing System - RSA Key Generator"
echo "=============================================="
echo ""

# Check if openssl is installed
if ! command -v openssl &> /dev/null; then
    echo "Error: openssl is not installed"
    echo "Please install openssl: sudo apt-get install openssl"
    exit 1
fi

# Create keys directory if it doesn't exist
mkdir -p keys

echo "Generating 1024-bit RSA private key..."
openssl genrsa -out keys/private_key.pem 1024

if [ $? -eq 0 ]; then
    echo "✓ Private key generated: keys/private_key.pem"
else
    echo "✗ Failed to generate private key"
    exit 1
fi

echo ""
echo "Extracting public key..."
openssl rsa -in keys/private_key.pem -pubout -out keys/public_key.pem

if [ $? -eq 0 ]; then
    echo "✓ Public key generated: keys/public_key.pem"
else
    echo "✗ Failed to generate public key"
    exit 1
fi

echo ""
echo "Converting private key to single-line format for .env..."
PRIVATE_KEY=$(awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' keys/private_key.pem)

echo ""
echo "=============================================="
echo "Add this to your .env file:"
echo "=============================================="
echo ""
echo "RSA_PRIVATE_KEY=\"$PRIVATE_KEY\""
echo ""
echo "=============================================="
echo ""
echo "IMPORTANT:"
echo "1. Keep private_key.pem secure and NEVER commit to git"
echo "2. Make encrypted backups in multiple locations"
echo "3. Store public_key.pem for signature verification"
echo "4. Rotate keys annually (notify AT before rotation)"
echo ""
echo "Keys location: $(pwd)/keys/"
echo "=============================================="
