# Crowdie Backend 

This is the backend implementation of Crowdie built using FastAPI.

## Project Structure

```
.
├── app.py                # Main FastAPI application entry point
├── dependencies.py       # Shared dependencies (e.g., DB sessions)
├── crud/                 # CRUD operations for interacting with the database
├── models/               # SQLAlchemy ORM models 
├── routers/              # FastAPI routers
├── schemas/              # Pydantic schemas 
├── services/             # service layer
├── utils/                # Utility functions and helpers
├── Dockerfile            # Dockerfile for containerizing the application
├── requirements.txt      # Python package dependencies
└── start.sh              # Script for migrations and app start in production (PostgreSQL)
```
## How to Run the Application in Development

1. **Create Python Environment (3.12)**: Set up your Python environment, either with `conda` or using a regular virtual environment.

    - For `conda`:
      ```bash
      conda create -n myenv python=3.12
      conda activate myenv
      ```

    - For `venv`:
      ```bash
      python3.12 -m venv myenv
      source myenv/bin/activate  # On Windows: myenv\Scripts\activate
      ```

2. **Install PyTorch**: Follow the [official PyTorch installation guide](https://pytorch.org/get-started/locally/) to install PyTorch, ensuring it's compatible with your environment.

3. **Install Dependencies**: Once the environment and PyTorch is set up, install all other required Python dependencies from the `requirements.txt` file:

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the FastAPI Application**: Start the application locally with the following command:

    ```bash
    uvicorn app:app --reload
    ```

    This will start the development server at `http://localhost:8000` with auto-reloading enabled for any code changes.


## API Endpoints

### Task Endpoints


- `POST tasks/create/` - Creates a new task. Requires task name, description, threshold, number of required answers, and files.

- `GET tasks/tasks/` - Retrieves all tasks associated with the currently authenticated user.

- `GET tasks/crowd_tasks/` - Retrieves tasks that other users have created.

- `DELETE tasks/delete/{task_id}` - Deletes a specific task identified by `task_id`.

- `GET tasks/microtask/{task_id}/` - Retrieves a microtask associated with a specific task identified by `task_id`.

- `POST tasks/microtask_answer/` - Submits an answer to a microtask. Updates counts and checks if the microtask and task are completed.

### User Endpoints

- `POST users/signup/` - Creates a new user account. Requires a username and password, technical background.

-  `POST users/login/` -  Authenticates a user and returns an access token. Requires a username and password.

## Future Plans

- Implement comprehensive unit and integration tests to ensure the reliability of the application.
- Expand the API with additional endpoints and features 

