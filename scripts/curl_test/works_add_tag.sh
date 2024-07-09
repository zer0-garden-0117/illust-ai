#!/bin/bash

# Enable debug mode to print each command before executing it
set -x

# Execute the curl command
curl -X POST http://localhost:8080/works/1/tags -H "Content-Type: application/json" -d '{
    "id": "零崎真白",
    "name": "零崎真白"
}'