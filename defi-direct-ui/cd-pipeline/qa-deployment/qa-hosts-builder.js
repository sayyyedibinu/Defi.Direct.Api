const yaml = require('js-yaml');
const fs = require('fs');
const mysql = require('mysql');

try {
    //const config = yaml.safeLoad(fs.readFileSync('k8s/prod-deployment.1.yaml', 'utf8'));
    console.log(__dirname);
    let configs = yaml.loadAll(fs.readFileSync('./defi-direct-ui/cd-pipeline/qa-deployment/k8s/qa-deployment.ingress.yaml', 'utf8'));
    //console.log(yaml.dump_all(configs));
    //return;
    configs.forEach((config) => {
        try {
            if (config.kind === 'Ingress' && config.metadata.name === 'defi-directui-qa-ext-ingress-baseline') {
                const connString = 'Server=defi-apps-nonprod-db-direct-02.cluster-cktexlr9o6uj.us-east-1.rds.amazonaws.com;Database=direct;Uid=DirectTest;Pwd=Direct2114!0;';
                const connStringItems = connString.split(';');
                let connObject = {};
                connStringItems.forEach((value) => {
                    if (value.indexOf('=') !== -1) {
                        const tokens = value.split('=');
                        if (tokens.length === 2) {
                            let key = tokens[0];
                            switch (tokens[0]) {
                                case 'Server': key = 'host';
                                break;
                                case 'Database': key = 'database';
                                break;
                                case 'Uid': key = 'user';
                                break;
                                case 'Pwd': key = 'password';
                                break;
                            }
                            connObject[key] = tokens[1];
                        }
                    }
                });
                let connection = mysql.createConnection(connObject);
                connection.connect();
                connection.query('SELECT * from Clients', function (error, results, fields) {
                  //console.log(error);
                  //console.log(results);
                  results.forEach((result) => {
                      const hostName = result.HostName;
                      const hostBase = result.HostName.split('.')[0];
                      if (hostBase !== 'baseline-qa' && hostBase !== 'demonew-qa') {
                        let newConfig = JSON.parse(JSON.stringify(config));
                        newConfig.metadata.name = 'defi-directui-qa-ext-ingress-' + hostBase;
                        newConfig.spec.rules[0].host = hostName;
                        newConfig.spec.tls[0].hosts[0] = hostName;
                        //console.log(newConfig);
                        configs.push(newConfig);
                      }
                  })
                  //console.log(configs);
                  let output = '';
                  configs.forEach((config) => {
                      output = output + yaml.safeDump(config) + `
---
`;
                  })
                  output = output.substring(0, output.lastIndexOf("\n"));
                  output = output.substring(0, output.lastIndexOf("\n"));
                  //output = yaml.dump_all(configs);
                  fs.writeFileSync('./defi-direct-ui/cd-pipeline/qa-deployment/k8s/qa-deployment.ingress.yaml', output, 'utf8');
                  console.log(output);
                });
                connection.end();
            }
        } catch (exception) { }
    });
    //console.log(indentedJson);
    //console.log(configs);
} catch (e) {
    console.log(e);
}