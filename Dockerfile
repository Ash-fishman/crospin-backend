FROM public.ecr.aws/o0v7r5a0/nodejs16

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package.json ./
COPY package-lock.json ./
COPY ./src ./src
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./
COPY ./nest-cli.json ./

RUN npm install

RUN npm run build
