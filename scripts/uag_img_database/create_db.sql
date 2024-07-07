-- works テーブルの作成
CREATE TABLE works (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_image_url VARCHAR(255) NOT NULL,
    creator VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    language VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    page_count INTEGER NOT NULL,
    likes INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0
);

-- images テーブルの作成
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    s3_url VARCHAR(255) NOT NULL
);

-- tags テーブルの作成
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE
);

-- work_tags テーブルの作成
CREATE TABLE work_tags (
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (work_id, tag_id)
);

-- インデックスの作成
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_images_work_id ON images(work_id);
CREATE INDEX idx_work_tags_work_id ON work_tags(work_id);
CREATE INDEX idx_work_tags_tag_id ON work_tags(tag_id);
CREATE INDEX idx_works_category ON works(category);
CREATE INDEX idx_works_subject ON works(subject);
CREATE INDEX idx_works_language ON works(language);
CREATE INDEX idx_works_created_at ON works(created_at);
CREATE INDEX idx_works_updated_at ON works(updated_at);
CREATE INDEX idx_works_likes ON works(likes);
CREATE INDEX idx_works_downloads ON works(downloads);
CREATE INDEX idx_works_title ON works(title);
CREATE INDEX idx_works_creator ON works(creator);
CREATE INDEX idx_works_title_image_url ON works(title_image_url);
