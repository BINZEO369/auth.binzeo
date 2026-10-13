(function() {

              /* ---------- VIDEO SOUND TOGGLE + AUTO-MUTE ON SCROLL ---------- */
              function initVideo() {
                var v = document.getElementById('binzeo-setup-video');
                var b = document.getElementById('binzeo-video-sound-toggle');
                var videoSection = document.getElementById('binzeo-video-section');

                if (!v || !b) return false;

                // Ensure initial state is muted & UI reflects it
                try { v.muted = true; } catch (e) {}
                b.setAttribute('data-muted', 'true');
                b.setAttribute('aria-label', 'Turn sound on');
                b.setAttribute('title', 'Turn sound on');

                function applyMuted(muted) {
                  b.setAttribute('data-muted', muted ? 'true' : 'false');
                  b.setAttribute('aria-label', muted ? 'Turn sound on' : 'Turn sound off');
                  b.setAttribute('title', muted ? 'Turn sound on' : 'Turn sound off');
                }

                // Idempotent click handler (avoid stacking listeners)
                if (b.__bz_bound !== true) {
                  b.__bz_bound = true;
                  b.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();

                    var willUnmute = v.muted === true;

                    // Toggle muted
                    try { v.muted = !willUnmute; } catch (e) {}

                    // If unmuting: guarantee volume + play
                    if (willUnmute) {
                      try { v.volume = 1; } catch (e) {}
                      try {
                        var p = v.play();
                        if (p && typeof p.catch === 'function') {
                          p.catch(function() { /* ignore autoplay rejection */ });
                        }
                      } catch (e) {}
                    }

                    applyMuted(v.muted);
                  }, { passive: false });
                }

                // Auto-mute when section leaves viewport
                if ('IntersectionObserver' in window && videoSection && videoSection.__bz_bound !== true) {
                  videoSection.__bz_bound = true;
                  var vIO = new IntersectionObserver(
                    function(entries) {
                      entries.forEach(function(entry) {
                        if (!entry.isIntersecting && v.muted === false) {
                          try { v.muted = true; } catch (e) {}
                          applyMuted(true);
                        }
                      });
                    },
                    { threshold: 0.35 }
                  );
                  vIO.observe(videoSection);
                }

                // Auto-mute when tab hidden
                if (document.__bz_vis_bound !== true) {
                  document.__bz_vis_bound = true;
                  document.addEventListener('visibilitychange', function() {
                    if (document.hidden && v.muted === false) {
                      try { v.muted = true; } catch (e) {}
                      applyMuted(true);
                    }
                  });
                }

                // Sync UI in case React re-hydrates muted attribute
                v.addEventListener('volumechange', function() {
                  applyMuted(v.muted);
                });

                return true;
              }

              // Try immediately, then retry (React streaming safety)
              if (!initVideo()) {
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initVideo);
                }
                window.addEventListener('load', initVideo);
                setTimeout(initVideo, 300);
                setTimeout(initVideo, 800);
              }

              /* ---------- SCROLL-TRIGGERED CINEMATIC REVEALS ---------- */
              function revealAll() {
                document
                  .querySelectorAll('[data-reveal], [data-reveal-group]')
                  .forEach(function(el) { el.classList.add('is-visible'); });
              }

              function setupReveals() {
                var els = document.querySelectorAll(
                  '[data-reveal], [data-reveal-group]'
                );
                if (!els.length) return;

                var reduce = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (reduce || !('IntersectionObserver' in window)) {
                  revealAll();
                  return;
                }

                var io = new IntersectionObserver(
                  function(entries) {
                    entries.forEach(function(entry) {
                      if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                      }
                    });
                  },
                  {
                    threshold: 0.12,
                    rootMargin: '0px 0px -5% 0px',
                  }
                );

                els.forEach(function(el) { io.observe(el); });

                window.requestAnimationFrame(function() {
                  document
                    .querySelectorAll(
                      'main > .reference-shell > section:first-child [data-reveal], ' +
                      'main > .reference-shell > section:first-child [data-reveal-group]'
                    )
                    .forEach(function(el) { io.observe(el); });
                });
              }

              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', setupReveals);
              } else {
                setupReveals();
              }
            })();
