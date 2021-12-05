FROM node

COPY package.json package.json  
RUN npm install

# Add your source files
COPY . .  
CMD node index.js
EXPOSE 3000