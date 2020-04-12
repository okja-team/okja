gpg --import public_keys/*
gpg --batch --yes -a -o public_keys/$(echo $USER).gpg --export $EMAIL
echo "Finished importing and exporting keys"
