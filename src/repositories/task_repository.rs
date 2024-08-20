#![allow(dead_code)]

use super::*;
use crate::model::{Board, Task, TaskPriority};
use crate::repositories::board_repository::GET_BOARD_SQL;

#[derive(Clone)]
pub struct TaskRepository {
    pool: Pool<Postgres>,
}

impl TaskRepository {
    pub fn new(pool: Pool<Postgres>) -> TaskRepository {
        TaskRepository {
            pool,
        }
    }

     pub async fn create_task(&mut self, title: String, board_id: i32, target_id: Option<i32>, description: Option<String>) -> Result<Task, sqlx::Error> {
        let mut tx = self.pool.begin().await?;

        let board = sqlx::query_as::<_, Board>(GET_BOARD_SQL)
            .bind(board_id)
            .fetch_one(&mut *tx)
            .await?;

        let task = sqlx::query_as::<_, Task>("INSERT INTO tasks (title, board_id, target_id, description, visual_id) VALUES ($1, $2, $3, $4, $5) RETURNING *")
            .bind(title)
            .bind(board.id)
            .bind(target_id)
            .bind(description)
            .bind(board.visual_id_counter)
            .fetch_one(&mut *tx)
            .await?;

        sqlx::query("UPDATE boards SET visual_id_counter = visual_id_counter + 1 WHERE id = $1")
            .bind(board_id)
            .execute(&mut *tx)
            .await?;

        tx.commit().await?;

        Ok(task)
    }

    pub async fn update_task(&mut self, task_id: i32, title: Option<String>, description: Option<String>, target_id: Option<i32>, status: Option<i32>, task_priority: Option<TaskPriority>) -> Result<Task, sqlx::Error> {
        let mut tx = self.pool.begin().await?;

        if let Some(new_title) = title {
            sqlx::query("UPDATE tasks SET title = $1 WHERE id = $2")
                .bind(new_title)
                .bind(task_id)
                .execute(&mut *tx)
                .await?;
        }

        if let Some(new_description) = description {
            sqlx::query("UPDATE tasks SET description = $1 WHERE id = $2")
                .bind(new_description)
                .bind(task_id)
                .execute(&mut *tx)
                .await?;
        }

        if let Some(new_target_id) = target_id {
            sqlx::query("UPDATE tasks SET target_id = $1 WHERE id = $2")
                .bind(new_target_id)
                .bind(task_id)
                .execute(&mut *tx)
                .await?;
        }

        if let Some(new_status) = status {
            sqlx::query("UPDATE tasks SET status = $1 WHERE id = $2")
                .bind(new_status)
                .bind(task_id)
                .execute(&mut *tx)
                .await?;
        }

        if let Some(new_priority) = task_priority {
            sqlx::query("UPDATE tasks SET priority = $1 WHERE id = $2")
                .bind(new_priority as TaskPriority)
                .bind(task_id)
                .execute(&mut *tx)
                .await?;
        }

        let updated_task = sqlx::query_as::<_, Task>("SELECT * FROM tasks WHERE id = $1")
            .bind(task_id)
            .fetch_one(&mut *tx)
            .await?;

        tx.commit().await?;

        Ok(updated_task)
    }

    pub async fn delete_task(&mut self, task_id: i32) -> Result<(), sqlx::Error> {
        let mut tx = self.pool.begin().await?;

        sqlx::query("DELETE FROM tasks WHERE id = $1")
            .bind(task_id)
            .execute(&mut *tx)
            .await?;

        tx.commit().await?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    async fn create_board(pool: Pool<Postgres>) -> Board {
        sqlx::query_as::<_, Board>("INSERT INTO boards (name) VALUES ('test') RETURNING *")
            .fetch_one(&pool)
            .await
            .unwrap()
    }

    #[sqlx::test]
    async fn test_create_task(pool: Pool<Postgres>) -> sqlx::Result<()> {
        let board = create_board(pool.clone()).await;
        let mut task_repository = TaskRepository::new(pool);
        let task = task_repository.create_task("test".to_string(), board.id, None, None).await?;
        assert_eq!(task.title, "test");
        Ok(())
    }

    #[sqlx::test]
    async fn test_create_task_visual_id(pool: Pool<Postgres>) -> sqlx::Result<()> {
        let board = create_board(pool.clone()).await;
        let mut task_repository = TaskRepository::new(pool);
        let task = task_repository.create_task("test".to_string(), board.id, None, None).await?;
        let task2 = task_repository.create_task("test2".to_string(), board.id, None, None).await?;
        assert_eq!(task.visual_id, 1);
        assert_eq!(task2.visual_id, 2);
        Ok(())
    }

    #[sqlx::test]
    async fn test_update_task(pool: Pool<Postgres>) -> sqlx::Result<()> {
        let board = create_board(pool.clone()).await;
        let mut task_repository = TaskRepository::new(pool);
        let task = task_repository.create_task("test".to_string(), board.id, None, None).await?;
        let updated_task = task_repository.update_task(task.id, Some("new title".to_string()), Some("new description".to_string()), None, None, Some(TaskPriority::High)).await?;
        assert_eq!(updated_task.title, "new title");
        assert!(matches!(updated_task.description, Some(_) if updated_task.description.unwrap() == "new description"));
        assert!(matches!(updated_task.target_id, None));
        assert_eq!(updated_task.priority, TaskPriority::High);
        Ok(())
    }

    #[sqlx::test]
    async fn test_delete_task(pool: Pool<Postgres>) -> sqlx::Result<()> {
        let board = create_board(pool.clone()).await;
        let mut task_repository = TaskRepository::new(pool.clone());
        let task = task_repository.create_task("test".to_string(), board.id, None, None).await?;
        task_repository.delete_task(task.id).await?;

        let result = sqlx::query("SELECT * FROM tasks WHERE id = $1")
            .bind(task.id)
            .fetch_optional(&pool)
            .await;

        Ok(())
    }
}