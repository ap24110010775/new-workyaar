CREATE DATABASE IF NOT EXISTS workyaar;
USE workyaar;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider VARCHAR(32) NOT NULL,
  provider_user_id VARCHAR(191) NOT NULL,
  role ENUM('candidate', 'employer', 'admin') NOT NULL DEFAULT 'candidate',
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL,
  avatar_url TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_provider_user (provider, provider_user_id),
  UNIQUE KEY unique_email_provider (email, provider)
);

CREATE TABLE IF NOT EXISTS social_login_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(32) NOT NULL,
  logged_in_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_social_login_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);