<%!
import os
import codecs
%>

<%
    template_dict = {}
    for fname in os.listdir(angular_template_path):
        full_path = os.path.join(angular_template_path, fname)
        template_dict.update({fname: codecs.open(full_path, 'r', 'utf-8').read()})
%>

% for filename, contents in template_dict.iteritems():
    <script type="text/ng-template" id="/static/templates/${filename}">${contents}</script>
% endfor