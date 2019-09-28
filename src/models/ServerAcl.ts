/*
Copyright 2019 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { setToArray } from "../utils";

export interface ServerAclContent {
    allow: string[];
    deny: string[];
    allow_ip_literals: boolean;
}

export class ServerAcl {
    private allowedServers: Set<string> = new Set<string>();
    private deniedServers: Set<string> = new Set<string>();
    private allowIps = false;

    public allowIpAddresses(): ServerAcl {
        this.allowIps = true;
        return this;
    }

    public denyIpAddresses(): ServerAcl {
        this.allowIps = false;
        return this;
    }

    public allowServer(glob: string): ServerAcl {
        this.allowedServers.add(glob);
        return this;
    }

    public setAllowedServers(globs: string[]): ServerAcl {
        this.allowedServers = new Set<string>(globs);
        return this;
    }

    public denyServer(glob: string): ServerAcl {
        this.deniedServers.add(glob);
        return this;
    }

    public setDeniedServers(globs: string[]): ServerAcl {
        this.deniedServers = new Set<string>(globs);
        return this;
    }

    public literalAclContent(): ServerAclContent {
        return {
            allow: setToArray(this.allowedServers),
            deny: setToArray(this.deniedServers),
            allow_ip_literals: this.allowIps,
        };
    }

    public safeAclContent(): ServerAclContent {
        const allowed = setToArray(this.allowedServers);
        if (!allowed || allowed.length === 0) {
            allowed.push("*"); // allow everything
        }
        return {
            allow: allowed,
            deny: setToArray(this.deniedServers),
            allow_ip_literals: this.allowIps,
        };
    }
}