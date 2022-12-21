networkType=$1

if test "$networkType" = "hardhat"
then 
  # copy .env.hardhat to .env
  echo "Copying .env.hardhat to .env"
  cp .env.hardhat .env
elif test "$networkType" = "fuji"
then
  # copy .env.fuji to .env
  echo "Copying .env.fuji to .env"
  cp .env.fuji .env
else
  echo "Invalid network type"
  exit 1
fi