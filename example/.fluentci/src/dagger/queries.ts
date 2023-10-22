import { gql } from "../../deps.ts";

export const lint = gql`
  query lint($src: String!) {
    lint(src: $src)
  }
`;

export const push = gql`
  query push($src: String!, $token: String!) {
    push(src: $src, token: $token)
  }
`;
