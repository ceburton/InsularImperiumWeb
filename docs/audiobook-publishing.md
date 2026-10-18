# Publishing the Audiobook

How to regenerate audiobook chapters and put them live on insularimperium.com.

## How it fits together

| Piece | Where |
|---|---|
| Generator (Kokoro TTS) | `C:\insular-imperium-audio` (`make_audiobook.py`) |
| MP3 output | `C:\insular-imperium-audio\audiobook` |
| Audio hosting | Bunny.net Storage Zone `insular-imperium-audio`, served at `https://audio.insularimperium.com` |
| Chapter list | `web/src/data/audiobook.json` (written by the publish script) |
| Player page | `https://www.insularimperium.com/media/audiobook` |
| Podcast feed | `https://www.insularimperium.com/media/audiobook/feed.xml` |

The website (Vercel) only holds the chapter list. The MP3s live on Bunny.

## Regenerating chapters

1. **Generate the MP3s.** In `C:\insular-imperium-audio`, run:

   ```
   python make_audiobook.py
   ```

   Only changed chapters are re-rendered. Wait for it to finish; the publish script refuses to run while `.partial.` files are still in the audiobook folder.

2. **Upload to Bunny.** In this repo, run:

   ```
   npm run audio:publish
   ```

   Changed chapters are uploaded to a new versioned path (`v/<hash>/<slug>.mp3`); unchanged ones are skipped. `web/src/data/audiobook.json` is only rewritten after every upload succeeds.

3. **Deploy the site.** Commit and push the updated chapter list:

   ```
   git add web/src/data/audiobook.json
   git commit -m "Update audiobook chapters"
   git push
   ```

   Vercel redeploys, and the page and podcast feed point at the new files. Podcast apps pick up the change the next time they refresh the feed. Listeners' saved places carry over to the new version of a chapter.

## Changing tags or the cover only

To change the album, artist or embedded cover without re-rendering audio:

```
python make_audiobook.py --retag
```

Then run steps 2 and 3 above.

## Cleaning up old versions (optional)

Old chapter versions stay on Bunny so podcast apps and cached pages don't break. To delete versions that are no longer used and are more than 30 days old:

```
npm run audio:prune -- --dry-run   # shows what would be deleted
npm run audio:prune
```

## Setup on a new machine

The publish scripts read `web/.env.local`, which git ignores:

```
BUNNY_STORAGE_ZONE=insular-imperium-audio
BUNNY_STORAGE_HOST=ny.storage.bunnycdn.com
BUNNY_STORAGE_PASSWORD=<Storage Zone password from the Bunny dashboard, FTP & API Access>
AUDIO_BASE_URL=https://audio.insularimperium.com
```

If the MP3s are somewhere other than `C:\insular-imperium-audio\audiobook`, set `AUDIOBOOK_DIR` as well.
