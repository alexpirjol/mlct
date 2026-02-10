# DOCKER VOLUMES

This file documents the Docker volume strategy for the project.

## Development

- Volume: `mctl_data`
- Used for local development MongoDB
- Data persists between container restarts
- To reuse old data, ensure the volume name matches in `docker-compose.yml`

## Production

- Volume: `mlct_prod_mongo_data`
- Used for production MongoDB
- Data persists between container restarts
- Ensure volume name matches in `docker-compose.prod.yml`

## Recovery

- To recover lost data, use `podman volume ls` to list volumes
- Use `podman run` with the correct volume name to start MongoDB
- Data is preserved as long as the volume is not deleted

## Tips

- Explicit volume naming prevents accidental data loss
- Always check volume names before removing containers
- Use `podman inspect` to verify volume mount points

...existing content...
