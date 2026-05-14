
# Hollow Guard

A browser extension for Firefox that helps you stay focused by blocking access to short-form content on YouTube, TikTok, and Facebook. It uses a terminal-inspired interface and can be force-installed via policies to prevent easy removal.

## Features

- **YouTube Shorts blocking**: Hides Shorts sections from your feed and automatically redirects Shorts URLs to the normal video player.
- **TikTok & Facebook blocking**: Replaces the entire page with an interactive terminal overlay, except for Facebook Messenger.
- **Terminal-inspired interface**: A draggable terminal window provides command-based interaction and real-time feedback.
- **Persistent installation**: Can be force-installed through Firefox policies so it cannot be removed through the normal add-ons UI.

## Commands

The extension provides an interactive terminal both in the popup and on blocked pages. Type these commands to interact with it:

| Command | Description |
|---------|-------------|
| `guard [on\|off]` | Enable or disable the entire blocking system. |
| `status` | Display the current protection status. |
| `stats` | Show the number of blocks and estimated time saved. |
| `sudo [command]` | Attempt to bypass the restrictions (this will fail by design). |
| `clear` | Clear the terminal output. |
| `disable` | Temporarily turn off blocking. |
| `exit` | Navigate away from the blocked page to a productive site. |

## Keyboard Shortcuts

- **Tab** or **ArrowRight**: Autocomplete the current command.
- **ArrowUp** / **ArrowDown**: Cycle through your command history.


