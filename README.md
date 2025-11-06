# FachApp

Web-based platform designed to manage and streamline the process of reporting, tracking, and resolving user issues. It connects regular users, who can submit support requests (“tickets”), with specialists or support agents who are responsible for resolving those requests.

## Repository Structure

The repository is organized into the following directories:

```
\frontend
  \web
  ...
\services
  \account-service
  ...
\shared
  ...
```

## How to start selected service or whole app

Use `Ctrl+Shift+P` and select `Tasks:Run Task`

| Task | Result |
| ------ | ------ |
| Install All Dependencies | Install necessary dependencies in every application |
| Start App | Runs all services and frontend in seperated terminals |
| Start Frontend | Runs frontend web app |
| Start Account Service | Runs account service |

## First usage

1. Use `Ctrl+Shift+P` and select `Tasks:Run Task`.
2. Select `Install All Dependencies`.
3. Use `Ctrl+Shift+P` and select `Tasks:Run Task`.
4. Select `Start App`.

- Frontend will be available at http://localhost:3000.
- Account service will be available at http://localhost:4000.
