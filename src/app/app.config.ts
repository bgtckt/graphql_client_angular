import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { provideRouter } from '@angular/router';
import { InMemoryCache, split } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      // Create an http link:
      // http://localhost:4000/graphql
      const http = httpLink.create({
        uri: 'http://109.73.206.183:8000/graphql',
      });

      // Create a WebSocket link:
      // ws://localhost:4000/graphql
      const ws = new GraphQLWsLink(
        createClient({
          url: 'ws://109.73.206.183:8000/graphql',
        }),
      );

      const link = split(
        // Split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === Kind.OPERATION_DEFINITION &&
            definition.operation === OperationTypeNode.SUBSCRIPTION
          );
        },
        ws,
        http,
      );

      return {
        link,
        cache: new InMemoryCache(),
      };
    }),
  ]
};
