#include<iostream>
using namespace std;

int month(string month){
    if(month== "January"){
        return 1;
    }
    else if(month== "February"){
        return 2;
    }
    else if(month== "March"){
        return 3;
    }
    else if(month== "April"){
        return 4;
    }
    else if(month== "May"){
        return 5;
    }else if(month== "June"){
        return 6;
    }else if(month== "July"){
        return 7;
    }else if(month== "August"){
        return 8;
    }else if(month== "September"){
        return 9;
    }else if(month== "October"){
        return 10;
    }else if(month== "November"){
        return 11;
    }else if(month== "December"){
        return 12;
    }
    return -1;
};


int main(){
    string s;
    cout<<"enter the date"<<endl;
    cin>>s;
    cout<<endl;
    cout<<s<<endl;
    string ans;
    int n=s.size();
    for(int i=0;i<n;i++){
        if(s[i]>='a' && s[i]<='z'){
            ans.push_back()
        }

        
    }
    return 0;
}