CREATE TABLE users
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    is_admin BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE boards
(
    id                SERIAL PRIMARY KEY,
    visual_id_counter INTEGER     NOT NULL DEFAULT 0,
    name              VARCHAR(64) NOT NULL
);

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE teams
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255)  NOT NULL,
    board_id INT           NOT NULL REFERENCES boards (id),
    sq_freq  NUMERIC(4, 1) NOT NULL DEFAULT 0,
    lr_freq  NUMERIC(3, 1) NOT NULL DEFAULT 0
);

CREATE TABLE tasks
(
    id          SERIAL PRIMARY KEY,
    visual_id   INTEGER       NOT NULL,
    board_id    INT           NOT NULL REFERENCES boards (id),
    target_id   INT REFERENCES teams (id),
    title       VARCHAR(255)  NOT NULL,
    description TEXT,
    priority    task_priority NOT NULL DEFAULT 'medium',
    status      INTEGER       NOT NULL DEFAULT 0
);