# Local preview image for the Chirpy blog.
# Gems are installed at build time, so `docker compose up` starts in seconds.
FROM ruby:3.4

# Keep the Gemfile + lock inside the image (not in the mounted source dir),
# so the container never writes Gemfile.lock into your repo.
WORKDIR /gems
COPY Gemfile ./
ENV BUNDLE_GEMFILE=/gems/Gemfile
RUN bundle install --jobs 4

# Chirpy reads git history for "last updated" dates; the mounted repo is
# owned by your host user, so tell git it's safe.
RUN git config --global --add safe.directory /srv

WORKDIR /srv
EXPOSE 4000 35729

# Output goes to /tmp inside the container, so no _site/.jekyll-cache
# (owned by root) appears in your repo.
CMD ["bundle", "exec", "jekyll", "serve", \
     "--host", "0.0.0.0", \
     "--livereload", \
     "--destination", "/tmp/_site", \
     "--disable-disk-cache"]
