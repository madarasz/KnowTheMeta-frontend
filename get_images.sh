#!/bin/bash
# you need "jq" installed to run this script

# get card list
curl https://netrunnerdb.com/api/2.0/public/cards > cards.json

# get card data
codes=( $(cat cards.json | jq -r '.data[].code' ) )
imageurls=( $(cat cards.json | jq -r '.data[].image_url' ) )
titles=( $(cat cards.json | jq -r '.data[].title' | tr -s ' ' | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed "s/[^a-z0-9.-]//g") )
i=0

# iterate over cards
for card in "${codes[@]}"
do
    if [ ! -f "public/img/cards/$card.png" ]; then
        imageurl=${imageurls[$i]}
        title=${titles[$i]}
        echo "Downloading card image: $title"

        if [ "$imageurl" == "null" ]; then
            # download from NetrunnerDB
            if [ $card -lt 31001 ]; then
                # old cards
                curl "https://netrunnerdb.com/card_image/$card.png" > "public/img/cards/$card.png"
            else
                # new cards
                curl "https://netrunnerdb.com/card_image/large/$card.jpg" > "public/img/cards/$card.png"
            fi
        else
            # download from CardGameDB
            curl $imageurl > "public/img/cards/$card.png"
        fi
    fi
    ((i++))
done