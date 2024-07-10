#!/bin/bash

# Base URL
BASE_URL="http://localhost:8080"

# Function to get a work by ID
get_work() {
  echo "Executing: curl -X GET $BASE_URL/works/$1"
  curl -X GET "$BASE_URL/works/$1"
  echo -e "\n"
}

# Function to get images by work ID
get_images_by_work_id() {
  echo "Executing: curl -X GET $BASE_URL/works/$1/images"
  curl -X GET "$BASE_URL/works/$1/images"
  echo -e "\n"
}

# Function to get tags by work ID
get_tags_by_work_id() {
  echo "Executing: curl -X GET $BASE_URL/works/$1/tags"
  curl -X GET "$BASE_URL/works/$1/tags"
  echo -e "\n"
}

# Function to get all tags
get_all_tags() {
  echo "Executing: curl -X GET $BASE_URL/tags"
  curl -X GET "$BASE_URL/tags"
  echo -e "\n"
}

# Function to get a tag by ID
get_tag() {
  echo "Executing: curl -X GET $BASE_URL/tags/$1"
  curl -X GET "$BASE_URL/tags/$1"
  echo -e "\n"
}

# Test the API

# Assuming IDs 1, 2, 3 for works and 1, 2, 3, 4, 5 for tags

echo "Getting work by ID..."
get_work 1
get_work 2
get_work 3

echo "Getting images by work ID..."
get_images_by_work_id 1
get_images_by_work_id 2
get_images_by_work_id 3

echo "Getting tags by work ID..."
get_tags_by_work_id 1
get_tags_by_work_id 2
get_tags_by_work_id 3

echo "Getting all tags..."
get_all_tags

echo "Getting tag by ID..."
get_tag 1
get_tag 2
get_tag 3
get_tag 4
get_tag 5