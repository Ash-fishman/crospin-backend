CREATE TABLE users (
    id uuid NOT NULL,
    email_address varchar(256),
    first_name varchar(256),
    last_name varchar(256),
	full_name varchar(256) NOT NULL,
    role varchar(256) NULL,
	provider varchar(255) NOT NULL,
    deleted_at timestamptz
);

ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE users ADD CONSTRAINT users_roles_constraint CHECK (role IN ('artist','contentcreator','admin'));
CREATE UNIQUE INDEX users_email_index ON users(email_address,provider) WHERE deleted_at IS NULL;

CREATE TABLE users_files (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    file_id varchar(256) NOT NULL,
    file_type varchar(256) NOT NULL,
    original_file_name varchar(256) NOT NULL,
    mime_type varchar(256) NOT NULL,
    size numeric(8) NOT NULL,
    deleted_at timestamptz
);

ALTER TABLE users_files ADD CONSTRAINT users_files_pkey PRIMARY KEY (id);
ALTER TABLE users_files ADD CONSTRAINT users_files_types_constraint CHECK (file_type IN ('audio','contract','photo'));
ALTER TABLE users_files ADD CONSTRAINT users_files_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);