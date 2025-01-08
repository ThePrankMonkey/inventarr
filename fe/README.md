## Commands

```bash
# Add a package
docker compose exec fe npm install --save --prefix ./app react-toastify
```

## Issues

### Issue = Could not read package.json

```console
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/app/package.json'
```

This is because my WORKDIR is a directory above my pacakge.json. I should change this.

Workaround:

```bash
docker compose exec fe npm test --prefix ./app
```
