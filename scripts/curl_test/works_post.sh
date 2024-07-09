#!/bin/bash

# Enable debug mode to print each command before executing it
set -x

# Execute the curl command
curl -X POST http://localhost:8080/works -H "Content-Type: application/json" -d '{
    "id": "2",
    "title": "Sample Work",
    "titleImageUrl": "http://example.com/image.jpg",
    "creator": "zer0aiart",
    "category": "CG",
    "subject": "Sample1",
    "language": "en",
    "createdAt": "2023-01-01T00:00:00",
    "updatedAt": "2023-01-01T00:00:00",
    "pageCount": 100,
    "likes": 0,
    "downloads": 0
}'