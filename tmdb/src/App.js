import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Details from "./components/details/Details";
import PersonDetail from "./components/personDetail/PersonDetail";
import GenreSearch from "./components/genreSearch/GenreSearch";
import SearchResults from "./components/SearchResults/SearchResults";
import Watchlist from "./components/watchlist/Watchlist";
import LoginPage from "./components/loginPage/LoginPage";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/:media_type/:detail_id" element={<Details />} />
          <Route path="/person/:person_id" element={<PersonDetail />} />
          <Route path="/genre/:genre_id" element={<GenreSearch />} />
          <Route
            path="/searchresults/:search_result"
            element={<SearchResults />}
          />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
