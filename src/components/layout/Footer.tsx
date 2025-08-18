import React from 'react';
import { Heart, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Character AI
            </h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              Create, chat, and explore AI characters. Build your own AI personalities 
              and engage in meaningful conversations with characters created by the community.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/characters"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Characters
                </a>
              </li>
              <li>
                <a
                  href="/characters/create"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Character
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/characters?category=fictional"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fictional
                </a>
              </li>
              <li>
                <a
                  href="/characters?category=historical"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Historical
                </a>
              </li>
              <li>
                <a
                  href="/characters?category=educational"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Educational
                </a>
              </li>
              <li>
                <a
                  href="/characters?category=entertainment"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entertainment
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Character AI. All rights reserved.
            </p>
            <div className="flex items-center mt-4 sm:mt-0">
              <span className="text-sm text-muted-foreground mr-2">
                Made with
              </span>
              <Heart className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-muted-foreground">
                for the AI community
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}