/**              _         ___                       _
 *              | |    _  /  _|                     | |                        _
 *              | |   |_| | |  _____     ____    ___| |__    __ _____  _____  | |   _   _  ____  _____  ____
 *    author:   | |    _ [   ]/  _  \   /  _ \  /  _  |\ \  / //  _  \|  _  \[   ] | | | ||  __|/  _  \|  __|
 *              | L__ | | | | | ____|   | |_\ \ | |_| | \ \/ / | ____|| | | | | |_ | |_| || /   | ____|| /
 *              L____||_| |_| \_____|   \____\_\\_____/  \__/  \_____||_| |_| |___|\_____/|_|   \_____||_|
 *
 *    Life is an adventure. Be adventurous.
 *
 *    created: 02.10.2023 01:14:44
 *
**/
#include <iostream>
#include <string>

using namespace std;

int main() {
  ios_base::sync_with_stdio(false);
  cin.tie(0);
  
  string quote, author;
  while(true){
    getline(cin, quote);
    if(quote == "EOF") break;
    getline(cin, author);
    cout << "{\n";
    cout << "  \"quote\": \"" << quote << "\",\n";
    cout << "  \"author\": \"" << author << "\"\n";
    cout << "},\n";
  }

  return 0;
}

/**
 *        "To stop trying is never the solution."
 *        "You are not alone. Lord have your way."
 *        "Failure is another blessing. Only by accepting it calmly can it bring growth."
**/