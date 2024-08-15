use super::*;
use crate::repositories::board_repository::{Board, GET_BOARD_SQL};

#[derive(Debug, sqlx::Type)]
#[sqlx(type_name = "task_priority", rename_all = "snake_case")]
pub enum TaskPriority {
    Low,
    Medium,
    High,
}

#[derive(Debug, sqlx::FromRow)]
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

#[derive(Clone)]
pub struct TaskRepository {
    pool: Pool<Postgres>,
    board_id: i32,
}

impl TaskRepository {
    pub fn new(pool: Pool<Postgres>, board_id: i32) -> TaskRepository {
        TaskRepository {
            pool,
            board_id,
        }
    }

    pub async fn create_task(&mut self, title: String) -> Result<Task, sqlx::Error> {
        let mut tx = self.pool.begin().await?;

        let board = sqlx::query_as::<_, Board>(GET_BOARD_SQL)
            .bind(self.board_id)
            .fetch_one(&mut *tx)
            .await?;

        let task = sqlx::query_as::<_, Task>("INSERT INTO tasks (title, visual_id, board_id) VALUES ($1, $2, $3) RETURNING *")
            .bind(title)
            .bind(board.visual_id_counter)
            .bind(self.board_id)
            .fetch_one(&mut *tx)
            .await?;

        sqlx::query("UPDATE boards SET visual_id_counter = visual_id_counter + 1 WHERE id = $1")
            .bind(self.board_id)
            .execute(&mut *tx)
            .await?;

        tx.commit().await?;

        Ok(task)
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
        create_board(pool.clone()).await;
        let mut task_repository = TaskRepository::new(pool, 1);
        let task = task_repository.create_task("test".to_string()).await?;
        assert_eq!(task.title, "test");
        Ok(())
    }

    #[sqlx::test]
    async fn test_create_task_visual_id(pool: Pool<Postgres>) -> sqlx::Result<()> {
        create_board(pool.clone()).await;
        let mut task_repository = TaskRepository::new(pool, 1);
        let task = task_repository.create_task("test".to_string()).await?;
        let task2 = task_repository.create_task("test2".to_string()).await?;
        assert_eq!(task.visual_id, 0);
        assert_eq!(task2.visual_id, 1);
        Ok(())
    }
}