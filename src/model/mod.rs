use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, sqlx::FromRow)]
pub struct Board {
    pub id: i32,
    pub visual_id_counter: i32,
    pub name: String,
}

#[derive(Debug, sqlx::Type, Serialize)]
#[sqlx(type_name = "task_priority", rename_all = "snake_case")]
pub enum TaskPriority {
    Low,
    Medium,
    High,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct Task {
    pub id: i32,
    pub visual_id: i32,
    pub board_id: i32,
    pub target_id: Option<i32>,
    pub title: String,
    pub description: Option<String>,
    pub status: i32,
    pub priority: TaskPriority,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i32,
    pub name: String,
    //PLAINTEXT I DONT CARE ABOUT HASHING YET.
    pub password: String,
    pub is_admin: bool,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Team {
    pub id: i32,
    pub name: String,
    pub board_id: i32,
    pub sr_freq: Decimal,
    pub lr_freq: Decimal,
}