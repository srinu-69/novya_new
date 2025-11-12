from django.urls import path, re_path

from . import views


urlpatterns = [
  path("signup", views.studyroom_signup, name="studyroom_signup"),
  path("login", views.studyroom_login, name="studyroom_login"),
  path("token/refresh", views.studyroom_refresh_token, name="studyroom_refresh_token"),
  path("users", views.search_users, name="studyroom_search_users"),
  path("friend_request", views.create_friend_request, name="studyroom_create_friend_request"),
  re_path(r"^friend_requests/(?P<user_id>[^/]+)/?$", views.list_friend_requests, name="studyroom_friend_requests"),
  path("accept_request/<int:request_id>", views.accept_friend_request_view, name="studyroom_accept_request"),
  re_path(r"^friends/(?P<user_id>[^/]+)/?$", views.list_friends, name="studyroom_friends"),
  re_path(r"^friends/(?P<user_id>[^/]+)/search/?$", views.search_friends, name="studyroom_search_friends"),
  path("last_message/<int:friend_id>", views.last_message, name="studyroom_last_message"),
  path("messages/<int:identifier>", views.direct_messages_entry, name="studyroom_direct_messages"),
  path("messages/<int:message_id>/react", views.react_to_direct_message, name="studyroom_direct_message_react"),
  path("unread_count/<int:friend_id>", views.unread_count, name="studyroom_unread_count"),
  re_path(r"^unread_counts/(?P<user_id>[^/]+)/?$", views.unread_counts, name="studyroom_unread_counts"),
  re_path(r"^group_unread_counts/(?P<user_id>[^/]+)/?$", views.group_unread_counts, name="studyroom_group_unread_counts"),
  path("groups", views.create_group, name="studyroom_create_group"),
  re_path(r"^groups/(?P<user_id>[^/]+)/?$", views.list_groups, name="studyroom_list_groups"),
  path("groups/<int:group_id>/add_member", views.add_member, name="studyroom_add_member"),
  path("groups/<int:group_id>/remove_member", views.remove_member, name="studyroom_remove_member"),
  path("groups/<int:group_id>/make_admin", views.make_admin, name="studyroom_make_admin"),
  path("groups/<int:group_id>/remove_admin", views.remove_admin, name="studyroom_remove_admin"),
  path("groups/<int:group_id>/exit", views.exit_group, name="studyroom_exit_group"),
  path("group_info/<int:group_id>", views.group_info, name="studyroom_group_info"),
  path("group_messages/<int:identifier>", views.group_messages_entry, name="studyroom_group_messages"),
  path("group_messages/<int:message_id>/react", views.react_to_group_message, name="studyroom_group_message_react"),
  path("upload/individual/<int:friend_id>", views.upload_individual_attachment, name="studyroom_upload_individual"),
  path("upload/group/<int:group_id>", views.upload_group_attachment, name="studyroom_upload_group"),
]

