use std::vec;

use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup(version: String) -> FnResult<String> {
    let version = if version.is_empty() {
        "latest".to_string()
    } else {
        version
    };
    let stdout = dag()
        .pkgx()?
        .with_exec(vec!["pkgx", "install", &format!("buf@{}", version)])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn lint(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["buf"])?
        .with_exec(vec!["buf", "lint", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn format(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["buf"])?
        .with_exec(vec!["buf", "format", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn push(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["buf"])?
        .with_exec(vec!["buf", "push", &args])?
        .stdout()?;
    Ok(stdout)
}
