# Hollow Guard

A minimalist terminal interface for people who accidentally click on TikTok or YouTube Shorts and immediately regret their life choices.

## Purpose
This extension turns your browser into a bit of a jerk whenever you try to access brain-rotting content. It hides Shorts and replaces TikTok/Facebook with a draggable terminal that questions your identity and life goals.

## Commands
The popup and the block screens are fully interactive. Type these to feel like a hacker:
- guard [on|off]: Toggle the entire defense system.
- status: Check if your ideology is still intact.
- stats: See how many times you almost failed yourself today.
- sudo [command]: Try to bypass the rules (spoiler: it won't work).
- clear: Clean the screen after a session of self-reflection.
- disable: The coward's way out (turns off blocking).
- exit: Go back to being productive.

## Navigation
- Tab / ArrowRight: Complete the command because typing is hard.
- ArrowUp / ArrowDown: Cycle through your past mistakes (command history).

## How to Install (Permanent Discipline)
1. Ensure `hollow-guard.xpi` is located at `/home/jmy/Hollow/hollow-guard.xpi`.
2. Create the distribution directory:
   `sudo mkdir -p /usr/lib/firefox/distribution/`
3. Create or edit the policy file:
   `sudo nano /usr/lib/firefox/distribution/policies.json`
4. Paste the following configuration:
```json
{
  "policies": {
    "ExtensionSettings": {
      "yt-shorts-blocker@hollow.example.com": {
        "installation_mode": "force_installed",
        "install_url": "file:///home/jmy/Hollow/hollow-guard.xpi"
      }
    }
  }
}
```
5. Restart Firefox. If it worked, you can't easily uninstall this. That is the point.

Stay focused. Don't be a consumer of trash.
# Hollow
