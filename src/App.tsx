/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Search, BookA, Sparkles, RefreshCw, ChevronLeft, ChevronRight, Github, Twitter, Linkedin, Facebook, InstagramIcon, X, XIcon, FacebookIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { dictionaryData } from './data';

const ITEMS_PER_PAGE = 20;

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const initialWordIndex = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return seed % dictionaryData.length;
  }, []);

  const [featuredWord, setFeaturedWord] = useState(dictionaryData[initialWordIndex]);

  const handleRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * dictionaryData.length);
    setFeaturedWord(dictionaryData[randomIndex]);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return dictionaryData;
    const term = searchTerm.toLowerCase().trim();
    
    const matches = (text: string) => {
      const lowerText = text.toLowerCase();
      // Only match at the beginning of the string
      return lowerText.startsWith(term);
    }

    const engMatches = (text: string) => {
      const lowerText = text.toLowerCase();
      // Only match at the beginning of the string, or after a space, hyphen, or parenthesis incase of english words with multiple parts
      return lowerText.startsWith(term) ||  
       lowerText.includes('a ' + term) 
            
    };
    return dictionaryData.filter(
      (item) => matches(item.sumi) || engMatches(item.english)
    );
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-accent selection:text-white">
      {/* Header */}
      <header className="bg-accent border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            <BookA className="text-white w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Azatsa</h1>
          </div>
          <div className="text-sm text-white font-medium">
            Sumi-English Dictionary
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Word of the Day */}
        {!searchTerm && (
          <div className="mb-8 bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl p-6 md:p-8 border border-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Sparkles className="w-32 h-32 text-accent" />
            </div>
            <div className="relative z-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-accent font-semibold">
                  <Sparkles className="w-5 h-5" />
                  <span>Word of the Day</span>
                </div>
                <button
                  onClick={handleRandomWord}
                  className="flex items-center gap-2 text-sm text-accent bg-white/50 hover:bg-white/80 px-3 py-1.5 rounded-full transition-colors cursor-pointer shadow-sm border border-accent/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  Random Word
                </button>
              </div>
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block mb-1 px-2.5 py-1 bg-white text-accent text-xs font-semibold rounded-full uppercase tracking-wider shadow-sm">
                      Sumi
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{featuredWord.sumi}</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{featuredWord.meaning}</p>
                </div>

                <div className="hidden md:block w-px h-16 bg-accent/20 self-center"></div>

                <div className="flex-1 pt-4 md:pt-0 border-t md:border-t-0 border-accent/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block mb-1 px-2.5 py-1 bg-white text-gray-600 text-xs font-semibold rounded-full uppercase tracking-wider shadow-sm">
                      English
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">{featuredWord.english}</h3>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-accent/10">
                <p className="text-sm text-gray-600 font-medium">
                  Learn a new word every day to expand your vocabulary!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 outline-none placeholder:text-gray-400"
            placeholder="Search in English or Sumi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              {filteredData.length} results
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={item.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                    <div className="flex-1">
                      <span className="inline-block mb-3 px-2.5 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full uppercase tracking-wider">
                        Sumi
                      </span>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">{item.sumi}</h2>

                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">{item.meaning}</p>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-gray-200 self-center"></div>
                    <div className="flex-1 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <span className="inline-block mb-3 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                        English
                      </span>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{item.english}</h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No words found</h3>
                <p className="text-gray-500">We couldn't find anything matching "{searchTerm}"</p>
              </motion.div>
            )}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 sm:gap-2 pt-8 pb-4 flex-wrap">
              <button
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              {(() => {
                const pages = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  if (currentPage <= 4) {
                    pages.push(1, 2, 3, 4, 5, '...', totalPages);
                  } else if (currentPage >= totalPages - 3) {
                    pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                  } else {
                    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                  }
                }
                return pages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (typeof page === 'number') {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={page === '...'}
                    className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-accent text-white shadow-md'
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ));
              })()}

              <button
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-accent text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium mb-4">
            &copy; {new Date().getFullYear()} <br/> Developed by Kumghato Khala
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="GitHub"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Twitter"
            >
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
