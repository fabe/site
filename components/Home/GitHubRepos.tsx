import formatDate from "@/lib/formatDate";
import { LinkExternal } from "../Links";
import HomeSection from "./Section";

export type GitHubRepo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  primaryLanguage: string | null;
  starCount: number;
  pushedAt: string;
};

type GitHubReposProps = {
  repos: GitHubRepo[];
};

export default function GitHubRepos({ repos }: GitHubReposProps) {
  if (repos.length === 0) {
    return null;
  }

  return (
    <HomeSection title="GitHub">
      <div className="grid gap-4">
        {repos.map((repo) => (
          <article key={repo.htmlUrl}>
            <div>
              <LinkExternal href={repo.htmlUrl}>{repo.name}</LinkExternal>
            </div>
            <RepoMeta repo={repo} />
            {repo.description ? (
              <p className="pt-1 text-meta">{repo.description}</p>
            ) : null}
          </article>
        ))}
      </div>
      <div className="mt-4">
        <LinkExternal
          href="https://github.com/fabe"
          className="link-sm inline-flex items-center"
          iconSize={12}
        >
          View all
        </LinkExternal>
      </div>
    </HomeSection>
  );
}

type RepoMetaProps = {
  repo: GitHubRepo;
};

function RepoMeta({ repo }: RepoMetaProps) {
  const meta = [
    repo.primaryLanguage,
    repo.starCount > 0
      ? `${repo.starCount} star${repo.starCount === 1 ? "" : "s"}`
      : null,
    repo.pushedAt ? `Updated ${formatDate(repo.pushedAt, true)}` : null,
  ].filter((item): item is string => Boolean(item));

  if (meta.length === 0) {
    return null;
  }

  return <p className="pt-1 text-meta">{meta.join(" · ")}</p>;
}
