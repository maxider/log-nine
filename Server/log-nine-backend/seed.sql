INSERT INTO board (id, name) VALUES
	(1,"Main");

INSERT INTO team (name,board_id, freq_sr, freq_lr)  values 
    ("Gold", 1, 420, 60),
    ("Silver", 1, 421, 60),
    ("Bronz", 1, 422, 60);

INSERT INTO task (visual_id, board_id, target_id, title, description, status, priority, task_type)
    VALUES
    (1, 1, 1, "Seed the database", "Just have to put some data into the database so that stuff works", 0, 1, 1),
    (2, 1, 2, "Cook some bread", "Some bread would be nice right about now.", 0, 1, 1),
    (3, 1, 3, "Fetch some water", "Drinking would also be very nice if you ask me about it.", 0, 1, 1);
