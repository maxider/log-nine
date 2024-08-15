use super::*;
use crate::repositories::task_repository::Task;

#[derive(Debug, sqlx::FromRow)]
pub struct Board {
    pub id: i32,
    pub visual_id_counter: i32,
    pub name: String,
}

#[derive(Debug)]
pub struct BoardRepository {
    pool: Pool<Postgres>,
}

pub(super) const GET_BOARD_SQL: &'static str = "SELECT * FROM boards WHERE id = $1";

impl BoardRepository {
    pub fn new(pool: Pool<Postgres>) -> BoardRepository {
        BoardRepository {
            pool
        }
    }

    pub async fn create_board(&mut self, name: String) -> Result<Board, sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        let board = sqlx::query_as::<_, Board>("INSERT INTO boards (name) VALUES ($1) RETURNING *")
            .bind(name)
            .fetch_one(&mut *tx)
            .await?;
        tx.commit().await?;
        Ok(board)
    }

    pub async fn get_board_by_id(&mut self, id: i32) -> Result<Board, sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        let board = sqlx::query_as::<_, Board>(GET_BOARD_SQL)
            .bind(id)
            .fetch_one(&mut *tx)
            .await?;
        tx.commit().await?;
        Ok(board)
    }
    
    pub async fn _get_all_tasks(&mut self, board_id: i32) -> Result<Vec<Task>, sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        
        let tasks = sqlx::query_as::<_, Task>("SELECT * FROM tasks WHERE board_id = $1")
            .bind(board_id)
            .fetch_all(&mut *tx)
            .await?;
        
        tx.commit().await?;
        Ok(tasks)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[sqlx::test]
    async fn test_create_board(pool: Pool<Postgres>) -> sqlx::Result<()> {
        let mut board_repository = BoardRepository::new(pool);
        let board = board_repository.create_board("test".to_string()).await?;
        assert_eq!(board.name, "test");
        assert_eq!(board.visual_id_counter, 0);
        dbg!(board);
        Ok(())
    }

    #[sqlx::test]
    async fn test_get_board_by_id(pool: Pool<Postgres>) -> sqlx::Result<()> {
        let mut board_repository = BoardRepository::new(pool);
        let board = board_repository.create_board("test".to_string()).await?;
        let board = board_repository.get_board_by_id(board.id).await?;
        assert_eq!(board.name, "test");
        Ok(())
    }
}