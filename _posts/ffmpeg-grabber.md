---
title: Don't forget to use `.stop()` after recording video
---

When using JavaCV and FFMpegFrameRecorder, always call `.stop()` after recording all frames, otherwise you'll end up with ureadable file
