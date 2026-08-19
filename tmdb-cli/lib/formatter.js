const DIVIDER = '─';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';

function formatDate(releaseDate) {
  if (!releaseDate) {
    return 'Unknown date';
  }
  return releaseDate;
}

function formatRating(voteAverage) {
  const rating = typeof voteAverage === 'number' ? voteAverage.toFixed(1) : 'N/A';
  return `${rating}/10`;
}

function buildDivider(character, length) {
  return character.repeat(length);
}

function displayMovies(movies, typeTitle) {
  console.log(`${BOLD}${CYAN}${typeTitle}${RESET}`);
  console.log(buildDivider(DIVIDER, 60));

  if (!movies || movies.length === 0) {
    console.log(`${DIM}No movies found.${RESET}`);
    console.log(buildDivider(DIVIDER, 60));
    return;
  }

  movies.forEach((movie, index) => {
    const position = `${index + 1}.`;
    console.log(`${BOLD}${position} ${movie.title || 'Untitled'}${RESET}`);
    console.log(`   ${YELLOW}Rating:${RESET} ${formatRating(movie.vote_average)}`);
    console.log(`   ${GREEN}Release:${RESET} ${formatDate(movie.release_date)}`);
    console.log('');
  });

  console.log(buildDivider(DIVIDER, 60));
}

module.exports = {
  displayMovies,
};