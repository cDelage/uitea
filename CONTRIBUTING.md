# Contributing to UITEA

First off, thank you for taking the time to contribute!  
This project is open to community involvement, and every contribution is greatly appreciated.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Ways to Contribute](#ways-to-contribute)
3. [Development Guidelines](#development-guidelines)
4. [Commit Message Style](#commit-message-style)
5. [Pull Request Process](#pull-request-process)
6. [Testing](#testing)
7. [Continuous Integration](#continuous-integration)
8. [Security Policy](#security-policy)
9. [License](#license)
10. [Acknowledgements](#acknowledgements)

---


## Getting Started

1. **Fork** the repository and **clone** your fork locally.
   ```bash
   git clone https://github.com/<your username>/uitea.git
    ```

2. **Install dependencies**:

   ```bash
   cd uitea
   npm install
   cargo install tauri-cli
   cargo tauri dev
   ```
3. **Create a new branch** for your work:

   ```bash
   git checkout -b feat/short-description
   ```

---

## Ways to Contribute

| Type                   | How to Start                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| **Bug Reports**        | Open an issue with the bug label; include screenshots, stack traces, and reproduction steps. |
| **Feature Requests**   | Open an issue with the enhancement label; describe the need and possible solution.           |
| **Code Contributions** | Follow the [Pull Request Process](#pull-request-process) below.                              |
| **Documentation**      | Improve docs or examples; small fixes via “docs:” commits are welcome.                       |
| **Translations**       | Add or update `.po`/`.json` language files.                                                  |
| **Design**             | Share UI/UX ideas using mock-ups or Figma links in a discussion or issue.                    |

---

## Development Guidelines

* **Style Guide:** Follow <link to style guide or describe briefly>.
* **Linting/Formatting:** Run `npm run lint` (or equivalent) before committing.
* **Dependencies:** Use stable releases; avoid introducing unused packages.
* **Branch Naming:**

  * `feat/<topic>` – New features
  * `fix/<topic>` – Bug fixes
  * `docs/<topic>` – Documentation only
  * `chore/<topic>` – Build or maintenance tasks

---

## Commit Message Style

We use **conventional commits**:

```
<type>(optional-scope): <short summary>

<body>
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
Example:

```
feat(auth): add JWT refresh token endpoint
```

---

## Pull Request Process

1. Ensure your branch is up to date with `main`.
2. Open a PR against `main` with:

   * A clear title matching commit style.
   * A concise description of what and why.
   * Linked issues (e.g., “Closes #123”).
3. At least **one reviewer** must approve before merge.
4. Squash-merge is the default strategy.

---

## License

By contributing, you agree that your work will be licensed under the existing project license: MIT (see [`LICENSE`](./LICENSE.md)).

---

## Acknowledgements

Thanks to everyone who has already contributed!
Your time and expertise keep this project healthy and moving forward.
Feel free to add yourself to [`AUTHORS.md`](./AUTHORS.md) once your first PR is merged.
