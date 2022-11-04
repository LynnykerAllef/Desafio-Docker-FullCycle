FROM golang:1.18-alpine as build

WORKDIR /usr/src/app

COPY ./src/main.go ./

RUN go build -o /app ./main.go


FROM scratch

WORKDIR /usr/bin

COPY --from=build /app ./app

ENTRYPOINT [ "./app" ]

