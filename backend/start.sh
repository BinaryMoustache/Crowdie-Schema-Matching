#!/bin/bash

if [ "$ENV" == "production" ]; then
    echo "Running in production mode. Applying database migrations..."
    alembic upgrade head
else
    echo "Not in production mode. Skipping database migrations..."
fi

exec "$@"
