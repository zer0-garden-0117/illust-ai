#!/bin/bash

ENDPOINT="http://localhost:8080"

# Function to log and execute curl commands
execute_curl() {
    echo "Executing: $1"
    eval $1
    echo -e "\n"
}

# Test creating a new work
echo "Creating a new work..."
create_work_cmd="curl -X POST $ENDPOINT/works -H \"Content-Type: application/json\" -d '{\"title\": \"New Work\", \"titleImageUrl\": \"http://example.com/new_title_image.jpg\", \"creator\": \"New Creator\", \"category\": \"New Category\", \"subject\": \"New Subject\", \"language\": \"New Language\", \"createdAt\": \"2024-07-08T00:00:00\", \"updatedAt\": \"2024-07-08T00:00:00\", \"pageCount\": 50, \"likes\": 0, \"downloads\": 0}'"
execute_curl "$create_work_cmd"

# Test creating a new tag
echo "Creating a new tag..."
create_tag_cmd="curl -X POST $ENDPOINT/tags -H \"Content-Type: application/json\" -d '{\"name\": \"New Tag\"}'"
execute_curl "$create_tag_cmd"

# Test adding a tag to a work
echo "Adding a tag to a work..."
add_tag_to_work_cmd="curl -X POST $ENDPOINT/works/1/tags -H \"Content-Type: application/json\" -d '{\"id\": \"6\", \"name\": \"New Tag 6\"}'"
execute_curl "$add_tag_to_work_cmd"

# Test creating a new image
echo "Creating a new image..."
create_image_cmd="curl -X POST $ENDPOINT/works/images -H \"Content-Type: application/json\" -d '{\"workId\": \"1\", \"s3Url\": \"http://example.com/new_image.jpg\"}'"
execute_curl "$create_image_cmd"

# Test deleting a work by ID
echo "Deleting a work by ID..."
delete_work_cmd="curl -X DELETE $ENDPOINT/works/1"
execute_curl "$delete_work_cmd"

# Test deleting a tag by ID
echo "Deleting a tag by ID..."
delete_tag_cmd="curl -X DELETE $ENDPOINT/tags/1"
execute_curl "$delete_tag_cmd"