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