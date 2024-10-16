# Crowdie
![Application Screenshot](screenshots/welcome.png)
**Crowdie** is a prototype crowdsourcing platform aimed at improving the creation and validation of labeled datasets for schema matching. 

## Key Features

- **Upload CSV Tables**: Users can easily create schema matching tasks that meet their specific data needs by uploading CSV files.
  
- **Automated Similarity Generation**: The platform utilizes advanced algorithms to automatically generate similar pairs based on schema characteristics.


- **Crowd Verification**: Engage the community to verify the accuracy of data matches, ensuring high-quality results and enhancing trust in the output.


## Technologies Used

- **Frontend**: [React.js](https://reactjs.org/) - A JavaScript library for building user interfaces. See the [Frontend README](frontend/README.md).
  
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) - A high-performance web framework for building RESTful APIs. Refer to the [Backend README](backend/README.md).

- **Database**: [SQLAlchemy](https://www.sqlalchemy.org/) with [PostgreSQL](https://www.postgresql.org/) for asynchronous data interactions.

- **Containerization**: [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) for managing application environments and services.(TODO)

## Installation 

To set up Crowdie locally, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/BinaryMoustache/Crowdie-Schema-Matching.git
    cd crowdie
    ```