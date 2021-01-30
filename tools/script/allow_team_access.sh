for i in $(gpg -k | grep -Eo "[^<]+@\S+\.[^>]+"); do
    git secret tell $i
done
