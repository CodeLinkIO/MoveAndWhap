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
elif test "$networkType" = "mawSubnet"
then
  # copy .env.mawSubnet to .env
  echo "Copying .env.mawSubnet to .env"
  cp .env.mawSubnet .env
else
  echo "Invalid network type"
  exit 1
fi