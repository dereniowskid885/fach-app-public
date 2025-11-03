# FachApp

Web-based platform designed to manage and streamline the process of reporting, tracking, and resolving user issues. It connects regular users, who can submit support requests (“tickets”), with specialists or support agents who are responsible for resolving those requests.

## Repository Structure

The repository is organized into the following directories:

```
\frontend
  \web
\services
  \apis
    \account-service
  ...
\shared
  ...
```

## How to start selected service or whole app

Use `Ctrl+Shift+P` and select `Tasks:Run Task`

| Task | Result |
| ------ | ------ |
| Start App | Runs all services and frontend in seperated terminals |
| Start Account Service | Runs account service |

- Frontend will be available at http://localhost:3000.
- Account service will be available at http://localhost:4000.
