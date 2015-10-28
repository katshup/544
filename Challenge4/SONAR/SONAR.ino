//PETE
//USE 'PW' PIN FOR SIGNAL, INPUT TO PIN 7 ON AN ARDUINO
const int pwPin = 7;

//AVERAGING
//variables needed to store values
int arraysize = 9; //quantity of values to find the median (sample size). Needs to be an odd number

//declare an array to store the samples. not necessary to zero the array values here, it just makes the code clearer
int rangevalue[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0};
long pulse;
int modE; //AVERAGE DISTANCE
int STOP = 0; //STOP COMMAND SENT IF 1
bool startup;
void setup() {

  //Open up a serial connection
  Serial.begin(9600);
  //Wait for the serial connection
  delay(500);
}
//Main loop where the action takes place
void loop() {

  pinMode(pwPin, INPUT);
  for(int i = 0; i < arraysize; i++)
  {                    
    pulse = pulseIn(pwPin, HIGH);
    rangevalue[i] = pulse/58;
    delay(10);
  }
  //Serial.print("Unsorted: ");
  //printArray(rangevalue,arraysize);
  //isort(rangevalue,arraysize);
  //Serial.print("Sorted: ");
  //printArray(rangevalue,arraysize);
  //OUTPUT FOR COLLISION DETECTION
  modE = mode(rangevalue,arraysize);
  Serial.print("Average distance is: ");
  Serial.print(modE);
  Serial.print(" Centimeter");
  Serial.println();
  //////////////////////////////////////////
  //COLLISION DETECTION
  //MINIMUM MEASURED DISTANCE 14 CENTIMETERS
  //MAXIMUM MEASURED DISTANCE 642 CENTIMETERS
  if(modE <= 50) //IF THE FRONT OF THE CAR GOT CLOSER THAN 50 CENTIMETERS, TERMINATE DRIVING
  {
    startup = false; //SEND 'STOP" COMMAND TO THE WHEEL
    Serial.println("BEWARE OF PEDESTRIAN, STOPPPPPP!!!!!!");
    Serial.println();
  }
  else 
  {
    startup = true;
  }
  delay(1000);
}

/*-----------Functions------------*/ //Function to print the arrays.
void printArray(int *a, int n) {

  for (int i = 0; i < n; i++)
  {
    Serial.print(a[i], DEC);
    Serial.print(' ');
  }
  Serial.println();
}

//Sorting function
// sort function (Author: Bill Gentles, Nov. 12, 2010)
void isort(int *a, int n){
// *a is an array pointer function
  for (int i = 1; i < n; ++i)
  {
    int j = a[i];
    int k;
    for (k = i - 1; (k >= 0) && (j < a[k]); k--)
    {
      a[k + 1] = a[k];
    }
    a[k + 1] = j;
  }
}

//Mode function, returning the mode or median.
int mode(int *x,int n){

  int i = 0;
  int count = 0;
  int maxCount = 0;
  int mode = 0;
  int bimodal;
  int prevCount = 0;
  while(i<(n-1)){
    prevCount=count;
    count=0;
    while(x[i]==x[i+1]){
      count++;
      i++;
    }
    if(count>prevCount&count>maxCount){
      mode=x[i];
      maxCount=count;
      bimodal=0;
    }
    if(count==0){
      i++;
    }
    if(count==maxCount){//If the dataset has 2 or more modes.
      bimodal=1;
    }
    if(mode==0||bimodal==1){//Return the median if there is no mode.
      mode=x[(n/2)];
    }
    return mode;
  }

}





